import { approve } from "./App";
import { ethers } from "ethers";

export default function Escrow({
  address,
  arbiter1,
  arbiter2,
  beneficiary,
  handleApprove,
  signer,
  value,
}) {

  const alchemyProvider = new ethers.providers.JsonRpcProvider("YOUR HTTPS URL")
  
  const handleApprove = async () => {
    const escrow = ethers.Contract("Escrow", address, alchemyProvider);
    escrow.on('Approved', () => {
    document.getElementById(escrow.address).className =
      'complete';
    document.getElementById(escrow.address).innerText =
      "✓ It's been approved!";
    })
    await approve(escrow, signer);
  }
  

  return (
    <div className="existing-contract">
      <ul className="fields">
      <li>
          <div> Contract Address </div>
          <div> {address} </div>
        </li>
        <li>
          <div> Arbiter 1 </div>
          <div> {arbiter1} </div>
        </li>
        <li>
          <div> Arbiter 2 </div>
          <div> {arbiter2} </div>
        </li>
        <li>
          <div> Beneficiary </div>
          <div> {beneficiary} </div>
        </li>
        <li>
          <div> Value </div>
          <div> {value} ETH </div>
        </li>
        <div
          className="button"
          id={address}
          onClick={(e) => {
            e.preventDefault();

            handleApprove();
          }}
        >
          Approve
        </div>
      </ul>
    </div>
  );
}
