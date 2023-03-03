import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import deploy from './deploy';
import Escrow from './Escrow';


const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();
  const [contracts, setContracts] = useState();
  const [escrowContracts, setEscrowContracts] = useState([]);

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send('eth_requestAccounts', []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
  }, [account]);

  async function newContract() {
    const beneficiary = document.getElementById('beneficiary').value;
    const arbiter1 = document.getElementById('arbiter1').value;
    const arbiter2 = document.getElementById('arbiter2').value;
    const value = ethers.utils.parseEther(document.getElementById('eth').value);
    const escrowContract = await deploy(signer, arbiter1, arbiter2, beneficiary, value);
    setEscrowContracts([...escrowContracts, escrowContract]);

    const escrow = {
      address: escrowContract.address,
      arbiter1,
      arbiter2,
      beneficiary,
      value: document.getElementById('eth').value,
    };

    setEscrows([...escrows, escrow]);

    await fetch('http://localhost:8000/escrows', {
      method: 'POST',
      body: JSON.stringify(escrow),
      headers: { 'Content-Type': 'application/json' }
    });

  //  window.location.replace("/");
  }

  useEffect(() => {
    async function getContracts() {
      const res = await fetch('http://localhost:8000/escrows');
      const contract = await res.json();
      setContracts(contract);
    } 
    getContracts();
  }, []);

  console.log("contracts: ", contracts);
  console.log("escrowcontracts: ", escrowContracts);
  console.log("escrows: ", escrows);

  return (
    <>
      <div className="contract">
        <h1> New Contract </h1>
        <label>
          Arbiter 1 Address
          <input type="text" id="arbiter1" />
        </label>

        <label>
          Arbiter 2 Address
          <input type="text" id="arbiter2" />
        </label>

        <label>
          Beneficiary Address
          <input type="text" id="beneficiary" />
        </label>

        <label>
          Deposit Amount (in ETH)
          <input type="text" id="eth" />
        </label>

        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();

            newContract();
          }}
        >
          Deploy
        </div>
      </div>

      <div className="existing-contracts">
        <h1> Existing Contracts </h1>

        <div id="container">
          {contracts && contracts.map((contract) => {
            return <Escrow key={contract.address} signer={signer}{...contract}/>;
          })}
        </div>
      </div>
    </>
  );
}

export default App;
