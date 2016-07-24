# timeSelect
A plugin to select time 
![preview](https://github.com/nummy/timeSelect/blob/master/doc/img/demo.png)

## TOC

## Installation

## Download
[download](https://github.com/nummy/timeSelect/archive/master.zip)

## Usage

1. Include timeSelect StyleSheet

   ```html
   <link rel="stylesheet" href="timeSelect.css">
   ```

2. Include jQuery

   ```html
   <script src='jQuery.js'></script>
   ```

3. Include timeSelect plugin's code

   ```html
   <script src="timeSelect.js"></script>
   ```

4. Add `data-toggle="timeSelect"` to table

   ```html
   <table data-toggle="timeSelect" id="demo"></table>
   ```

   or call plugin like this:

   ```javascript
   $("#demo").timeSelect();
   ```

5. Call `getValue` to get selected time:

   ```javascript
   var data = $("#demo").timeSelect("getValue");
   ```

6. Call `setValue` to set selected time:

   ```javascript
   $("#demo").timeSelect("setValue", data);
   ```
   data should be a string , contains only 1 and 0, and the length must be 336 