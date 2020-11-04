pragma solidity ^0.5.16;

contract Person
{
    address owner;
    uint id;
    string name;
    uint count = 0;
    uint index = 1111111111111111111;
    mapping (uint => person) Person;
    event getPersonDetails(uint , uint, string);


    struct person
    {
        uint _index;
        uint _id;
        string _name;
    }

    constructor() public
    {
        owner = msg.sender;
    }

    modifier isowner()
    {
        require(msg.sender==owner, "Hey, You are not ADMIN!");
        _;
    }

    function addPerson(string memory _name) public isowner
    {
        Person[count] = person(index, count, _name);
        emit getPersonDetails(index, count, _name);
        count++;
        index++;
    }

    function getPerson(uint _id) public view returns(uint, uint, string memory)
    {
        return (Person[_id]._index, Person[_id]._id, Person[_id]._name);
    }

    function getCount() public view returns(uint)
    {
        return count;
    }

    function deletePerson(uint _id) public isowner
    {
        delete Person[_id];
    }

}