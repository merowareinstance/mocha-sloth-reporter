# mocha-sloth-reporter

Mocha reporter to detect slow tests and display to github actions if enabled

## Install

    npm install --save-dev mocha-sloth-reporter
    
## Use

    mocha --reporter mocha-sloth-reporter

### Parametes 

--slow <Integer>
  Default: 75 ms
  Display:
    If test is higher than value then it will be displayed in yellow and/or warning if actions enabled
    If test is higher than double the value then it will be displayed in red and/or error if actions enabled
  Example:
    mocha --reporter mocha-sloth-reporter --slow 100

--actions <boolean>
  Default: false
  Example:
    mocha --reporter mocha-sloth-reporter --actions true
    
## Output

Console Output

```
Slothy Test Count: 1

1006 ms Slothy Suite Such A Slothy Test
```

Github Actions Annotations Output

![Github Actions Annotations Output](img/Github-Actions-Annotations-Output.png)