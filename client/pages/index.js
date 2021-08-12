import React, { useState, useEffect } from "react";
import factoryInstance from "../contracts/campaignFactory.json";
import getWeb3 from "../lib/getWeb3.js";

function index() {
    const [web3, setWeb3] = useState(undefined);
    const [accounts, setAccounts] = useState([]);
    const [contract, setContract] = useState([]);
    const [allCampaigns, setAllCampaigns] = useState([]);

  
  
    useEffect(() => {
      const init = async () => {
        try {
          // Get network provider and web3 instance.
          const web3 = await getWeb3();
    
          // Use web3 to get the user's accounts.
          const accounts = await web3.eth.getAccounts();
    
          // Get the contract instance.
          const networkId = await web3.eth.net.getId();
          const deployedNetwork = factoryInstance.networks[networkId];
          const instance = new web3.eth.Contract(
            factoryInstance.abi,
            deployedNetwork && deployedNetwork.address,
          );
          // Set web3, accounts, and contract to the state, and then proceed with an
          // example of interacting with the contract's methods.
          setWeb3(web3);
          setAccounts(accounts);
          setContract(instance);
  
        } catch (error) {
          // Catch any errors for any of the above operations.
          alert(
            `Failed to load web3, accounts, or contract. Check console for details.`,
          );
          console.error(error);
        }
      }
      init();
    }, []);
    
    useEffect(() => {
      const load = async () => {
        const allCampaigns = await contract.methods.getDeployedCampaign().call();
        
        console.log(allCampaigns);
        setAllCampaigns(allCampaigns);
      }
      if (typeof web3 !== 'undefined'
        && typeof accounts !== 'undefined'
        && typeof contract !== 'undefined'){
          load();
        }
    },[contract]);


    if (typeof web3 === 'undefined') {
        return <div>Loading Web3, accounts, and contract...</div>;
      } 
      else {
      return (<div>
        <h1 style={{textAlign: "center"}}>Crowd Coin</h1>
        <h2>Open campaigns</h2>

        <ul>
        {allCampaigns.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
        <form method="get" action="/newCampaign">
        <button>Create Campaign</button>
        </form>

        </div>);
        }
    
    }
    
    
    
    export default index;