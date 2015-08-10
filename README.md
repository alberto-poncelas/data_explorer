
The purpose of this is to have an easy way to explore the data. It is made in python and D3 has been used for the graphs.

The data (.csv) must meet the following requirements:
* CSV must have one of the following seperators: [',' , ';' , '|', '\t']
* It can have header or not, it is optional
* All columns must be numeric

The application will find automatically if it has a header and which is the separator.




Usage:
Execute it with the name of a function [summary,pca] and the path of the file.

	python data_explorer.py  function_name ./the/path/of/file.csv



Example of usage:

Launch summary of columns:
python data_explorer.py summary ./examples/data.csv

Launch PCA:
python data_explorer.py pca ./examples/data.csv 
