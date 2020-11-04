App = {
  web3Provider: null,
  contracts: {},
  account : "0x0",

  init: async function()
  {
    return await App.initWeb3();
  },

  initWeb3: async function()
  {
    if(typeof web3 != 'undefined')
    {
        App.web3Provider = web3.currentProvider;
        web3 = new Web3(web3.currentProvider);
    }
    else
    {
        App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
        web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {
    $.getJSON("../Person.json", function(person){
      App.contracts.Person = TruffleContract(person);
      App.contracts.Person.setProvider(App.web3Provider);
    }).done(function(){
      App.getPersonFun();

      return App.bindEvents();

    });
  },

  bindEvents: function() {

    web3.eth.getCoinbase(function(err, account){
        if(err==null){
          App.accounts = account;
        }
    });

  },

  addPersonFun: async function()
  {
    App.contracts.Person.deployed().then(async function(instance){
      var namePerson = document.getElementById('personName').value;
      if(namePerson=="")
      {
          alert("Input The Person Name");
      }
      else
      {
        await instance.addPerson(namePerson.toString(), {from: App.accounts});
        App.getPersonFun();
      }
    }).catch(function(err)
    {
      location.reload();
    });

  },

  deletePersonFun: async function()
  {
    App.contracts.Person.deployed().then(async function(instance){
      var delID = document.getElementById('personID').value;
      if(delID=="")
      {
        alert("Input The Person ID to delete");
      }
      else
      {
        await instance.deletePerson(parseInt(delID), {from: App.accounts});
        App.getPersonFun();
      }
    });
  }

  ,

  getPersonFun: async function()
  {
    App.contracts.Person.deployed().then(async function(instance){
      var count = await instance.getCount();
      if(count==0)
      {
        document.getElementById('getData').innerHTML = "<tr><td>N/A</td><td>N/A</td><td>N/A</td></tr>";
      }
      else {
        document.getElementById('getData').innerHTML = "";

        for (var i = 0; i < count; i++) {
          var person = await instance.getPerson(i);

          if(person[0].toNumber()!=0) {
            document.getElementById('getData').innerHTML += "<tr><td>" + person[0] + "</td><td>" + person[1] + "</td><td>" + person[2] + "</td></tr>";
          }

        }
      }
    });

  },
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
