# PolySwarm Gui

This gui is used to post Bounties to the PolySwarm marketplace running on Ethereum.

It lets the user select one or many suspicious files for analysis in the marketplace. 

# Prerequisites

To use this app a user needs an ERC20 compatible Ethereum wallet with Nectar, and some Eth for gas.

If the user doesn't have a wallet, the application will create one for them on the first attempt to post a bounty. A popup will open prompting for a password. Enter one, and a new wallet will be created with that password. However, the account won't have any Nectar or ETH, so it can't post a bounty. Transfer some ETH and Nectar from a funded wallet to get started.

# Managing Bounties

On first login users will be greeted with a welcome screen. Click the 'Get Started' button to find the main screen. The Welcome screen is only displayed once.

## Creating Bounties

The create bounties screen is the first screen after welcome on the first visit, or subsequent visits without creating any bounties. Users can get to this screen again by clicking the '+ Bounty' button.

This screen has a large drop target and list of files, and a button to create the bounty. The create button will remain disabled until the user adds some files to be uploaded.

A user adds files by either dragging and dropping the files into the light-purple drop target, or selecting files with the button inside. When ready to create, click the create button. This will open a modal window for unlocking the account. Select the desired account from the drop down, enter the password and click unlock. If there are no accounts in geth, the application will provide the opportunity to create an account. Enter the desired password, and the account will be created. However, this account will not be able to post any bounties until it has been funded with ETH for gas, and NCT for the bounty. 

With a funded account, after it is unlocked it will upload the files and post the bounty. Due to the nature of blockchain, this will take a fair bit of time. During the wait feel free to look at any existing bounties that been created. When the bounty finishes posting, the sidebar will show the new bounty GUID. 

In the event of an error, a modal window will popup letting the user know about the failure.

## Viewing Bounties

To view a bounty, click the GUID in the sidebar on the left. This opens a screen that displays the files in the bounty and the assertions on them. The file list shows the names of uploaded files, and a ratio of safe verdicts over total verdicts. This ratio will be green if over 70% of verdicts deem it safe, yellow if between 50% and 69% , and red if under 50%. 

When a user clicks a file, the scrolling table on the right populates with assertions for that file. It gives the author, verdict, bid, and metadata. The metadata and bid are bounty specific, and may not pertain directly to the file displayed. For instance the author of the assertion may use metadata state the malware family of the file they judged malicious of a dozen.

# Running the Application

This application uses Electron to operate as a desktop application, no browser required. We provide .deb, .rpm and soon .exe versions of the application. Install the appropriate package for the host operating system. (Sorry, no macOS, yet). Before running the application, make sure  both geth and IPFS are running.

Start geth with `geth --rpc --rpcapi "eth,web3,personal,net,debug" --ws --wsaddr "0.0.0.0" --wsport 8546 --wsapi "eth,web3,personal,net,debug" --wsorigins "*"`

We expect geth rpc top be on 8545 and IPFS on 5001. If  change those, please set the ETH_URI and IPFS_URL accordingly. Examples are below.

```.env
ETH_URI=http://localhost:8545
IPFS_URI=http://localhost:5001
```

Once everything is running & configured, run `polyswarm-gui` to launch the application.

When running from source, install node, and electron-forge. Run `electron-forge start` to launch.

# Running on Rinkeby

If a user needs to run tests and need to deploy to Rinkeby for some tests, there are a couple things to change.

1. Add the `--rinkeby` option to geth. 
2. Edit the polyswarmd.cfg file (example below) with Rinkeby contract addresses (We don't provide any, but new contracts can be deployed with truffle).

```polyswarm.cfg
NECTAR_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000'
BOUNTY_REGISTRY_ADDRESS = '0x0000000000000000000000000000000000000000'
```

# Cost

Currently, the application uses 1/16 NCT as a bid, and the contract adds an additional 1/16 NCT as a fee paid to the Arbiters. This means each bounty costs 2/16 NCT and gas, to post a set of files for analysis. 