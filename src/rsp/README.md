# Rock Scissors Paper Game

# Config
## FinalBiome
1. Create Game - RPS
2. Add memer
3. Create FAs
  1. `energy`
    * Top Up - 1
    * Local Cup - 60
  2. `diamonds`
    * Top Up - None
    * Local Cup - None
4. Create NFA
  1. `bet`
    * Purchased (20 `energy`)
    * Bettor
      Outcomes:
      - 1 - win - Win
      - 1 - lose - Lose
      - 1 - draw - Draw
      Winings:
      - FA `energy` - 20
      - FA `diamonds` - 10
      Rounds: 5
      Draw Outcome: Keep
5. Create Onboarding
  - FA `energy` - 100

## Client
Set in [./MainCanvas.js](./MainCanvas.js) next consts:
* `GAME_ACCOUNT` - Game account address  
* `NUMBER_OF_ROUNDS` - 5  
* `FA_ID_ENERGY` - Id of `energy` FA  
* `FA_ID_DIAMOND` - Id of `diamonds` FA  
* `NFA_BET` - Id of `bet` NFA  
* `OFFER_ID` - Id of `bet` NFA's offer (by default 0)  

# TODO
[ ] Error handling when not enough energy  
[ ] Before starting a new game, try to find existing mechanics and resume the old game
[ ] Make error handling
