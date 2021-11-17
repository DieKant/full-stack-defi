// questo contratto serve per mettere, togliere, aggiungere interesse
// a token dallo staking, può essere usato anche per aggiungerne altri
// inoltre ci servira un pricefeed per capire il loro valore quando
// si aggiornano

// SPDX-Licence-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenFarm is Ownable {

    // lista dei token autorizzati
    address[] public allowedTokens;
    // array che tiene conto quanto token qualcuno ha messo in staking
    mapping(address => mapping(address => uint256)) public stakingBalance;

    function tokenIsAllowed (address _token) public returns(bool) {
        // questa funzione controlla che il token che sto cercando
        // di stakare sia stakabile
        for(uint256 allowedTokenIndex=0; allowedTokenIndex < allowedTokens.length; allowedTokenIndex++){
            if(allowedTokens[allowedTokenIndex] == _token){
                return true;
            }
        }
        return false;
    }

    function addAllowedToken(address _token) public onlyOwner {
        // questa funzione aumenta il numero di token autorizzati
        // allo staking, solo l'admin può usarla
        allowedTokens.push(_token);
    }

    function stakeTokens(uint256 _amount, address _token) public {
        // questa funzione permette di fare stake di tokens
        // rispettando i limiti di "quanto"(controllato dal require)
        // e "quali" (controllato dalla funzione tokenIsAllowed)
        require(_amount > 0, "Amount must be more than 0");
        require(tokenIsAllowed(_token), "Token is currently not allowed");
        // se il token è stakabile e ha l'amount giusto faccio apparire una richiesta
        // di transazione all'owner dell'account che vuole stakare a questo contratto
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        // dopodiche aggiungo l'amount a un array per non scordarmi
        // quanto qualcuno ha stakato e di cosa
        stakingBalance[_token][msg.sender] += _amount;
    }

}