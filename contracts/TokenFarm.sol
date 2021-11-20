// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract TokenFarm is Ownable {
    // questo contratto serve per mettere, togliere, aggiungere interesse
    // a token dallo staking, può essere usato anche per aggiungerne altri
    // inoltre ci servira un pricefeed per capire il loro valore quando
    // si aggiornano

    // lista dei token autorizzati
    address[] public allowedTokens;
    // array che tiene conto quanto token qualcuno ha messo in staking
    mapping(address => mapping(address => uint256)) public stakingBalance;
    // array degli stakers
    address[] public stakers;
    // mapping per tenere conto di quanti token stakati qualcuno possiede
    mapping(address => uint256) public uniqueTokensStaked;
    // il nostro token ricompensa
    IERC20 public dappToken;
    // mapping usa l'address di un token come indice per il suo contratto di price_feed
    mapping(address => address) public tokenPriceFeedMapping;

    constructor(address _dappTokenAddress) public {
        // creo il token ricompensa
        dappToken = IERC20(_dappTokenAddress);
    }

    function setPriceFeedContract(address _token, address _priceFeed)
        public
        onlyOwner
    {
        // prendo l'address del contratto che mi ritorna il valore in dollari di un token
        tokenPriceFeedMapping[_token] = _priceFeed;
    }

    function issueTokens() public onlyOwner {
        // da dei token come interesse per lo staking degli staker
        // per farlo ciclo tra gli staker e gli mando n tokens di
        // interessi su n token (il rateo è 1 dapp per 1 ether/tutto staked)
        for (
            uint256 stakersIndex = 0;
            stakersIndex <= stakers.length;
            stakersIndex++
        ) {
            address recipient = stakers[stakersIndex];
            // ci serve sapere quale è l'address del contratto del token da mandare
            // glie lo diamo da python quando deployamo il nostro contratto per il
            // token Dapp
            uint256 userTotalValue = getUserTotalValue(recipient);
            dappToken.transfer(recipient, userTotalValue);
        }
    }

    function getUserTotalValue(address _user) public view returns (uint256) {
        // questa funzione cicla tutti i token stakati e
        // ne calcola il prezzo totale in dollari, poi somma il tutto
        uint256 totalValue = 0;
        require(uniqueTokensStaked[_user] > 0, "No Token staked");
        for (
            uint256 allowedTokensIndex = 0;
            allowedTokensIndex < allowedTokens.length;
            allowedTokensIndex++
        ) {
            // prendo il valore in dollari del totale di n token
            // stakati dall'utente e lo aggiungo al totale
            totalValue += getUserSingleTokenValue(
                _user,
                allowedTokens[allowedTokensIndex]
            );
        }
    }

    function getUserSingleTokenValue(address _user, address _token)
        public
        view
        returns (uint256)
    {
        // questa funzione returna il valore in dollari del totale di token stakato
        if (uniqueTokensStaked[_user] <= 0) {
            return 0;
        }
        // prendiamo il prezzo del singolo token
        (uint256 price, uint256 decimals) = getTokenValue(_token);
        return ((stakingBalance[_token][_user] * price) / (10**decimals));
    }

    function getTokenValue(address _token)
        public
        view
        returns (uint256, uint256)
    {
        // questa funzione usa l'AggregatorV3Interface di chainlink per prendere
        // il prezzo di un singolo token in dollari e suoi decimali
        address priceFeedAddress = tokenPriceFeedMapping[_token];
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            priceFeedAddress
        );
        (, int256 price, , , ) = priceFeed.latestRoundData();
        uint256 decimals = uint256(priceFeed.decimals());
        return (uint256(price), decimals);
    }

    function updateUniqueTokensStaked(address _user, address _token) internal {
        // controllo se l'utente ha gia messo qualcosa in staking
        // e lo aggiungo all'elenco di staker, altrimenti passo
        if (stakingBalance[_token][_user] <= 0) {
            uniqueTokensStaked[_user] = uniqueTokensStaked[_user] + 1;
        }
    }

    function tokenIsAllowed(address _token) public returns (bool) {
        // questa funzione controlla che il token che sto cercando
        // di stakare sia stakabile
        for (
            uint256 allowedTokenIndex = 0;
            allowedTokenIndex < allowedTokens.length;
            allowedTokenIndex++
        ) {
            if (allowedTokens[allowedTokenIndex] == _token) {
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
        // controllo se l'utente va aggiunto alla lista degli staker
        // se ha 0 token validi stakati altrimenti non lo aggiungo
        updateUniqueTokensStaked(msg.sender, _token);
        // dopodiche aggiungo l'amount a un array per non scordarmi
        // quanto qualcuno ha stakato e di cosa
        stakingBalance[_token][msg.sender] += _amount;
        // se è la prima volta che l'utente staka qualcosa lo
        // aggiungo all'array di stakers
        if (uniqueTokensStaked[msg.sender] == 1) {
            stakers.push(msg.sender);
        }
    }

    function unstakeTokens(address _token) public {
        // questa funzione guarda quanto un utente ha in staking
        // per poi permettergli di ritirarlo
        uint256 balance = stakingBalance[_token][msg.sender];
        require(balance > 0, "Staking balance cannot be 0");
        IERC20(_token).transfer(msg.sender, balance);
        stakingBalance[_token][msg.sender] = 0;
        uniqueTokensStaked[msg.sender] = uniqueTokensStaked[msg.sender] - 1;

    }
}
