pragma solidity ^0.5.16;

contract Campaign{
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    
    modifier restricted() {
        require(msg.sender == manager, "not a manager");
        _;
    }
    
    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint approverCount;
    
    constructor(uint minimum, address creater) public {
        manager = creater;
        minimumContribution = minimum;
    }
    
    function contribute() public payable {
        require(msg.value > minimumContribution);
        
        approvers[msg.sender] = true;
        approverCount++;
    }
    
    function createRequest(string memory description, uint value, address recipient) 
    public restricted {
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });
        requests.push(newRequest);
    }
    
    function approveRequest(uint index) public {
        Request storage request = requests[index];
        
        require(approvers[msg.sender], "not a contributer");
        require(!request.approvals[msg.sender], "has already approved the request");
        
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }
    
    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        
        require(request.approvalCount > (approverCount/2), "not have enough consensus");
        require(!request.complete, "request already comleted");
        
        address payable _recipient = address(uint160(request.recipient));
        _recipient.transfer(request.value);
        request.complete = true;
    }
    
}