# parkalot-auto-reserve
Simple script I made to automatically reserve my parking spot

## Installation
`npm i -g https://github.com/snypelife/parkalot-auto-reserve.git` will install the binary into your global modules.

It uses puppeteer, which can take a bit to download. It's worth it though, I swear!

## Usage
`parkalot-reserve`: On first usage, it will prompt for configuration (i.e. useranme and password). Subsequent runs will automatically use the config file located at `~/parkalotrc`.

## Troubleshooting
If you run into login issues, just delete the `~/.parkalotrc` file and try reconfiguring the utility.
