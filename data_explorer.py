from flask import Flask
from flask_restful import Resource, Api
from flask.ext.cors import CORS
import webbrowser


app = Flask(__name__)
cors = CORS(app)
api = Api(app)





##### FUNCTIONS TO CREATE THE SUMMARY ######



import pandas as pd
import numpy as np
from sklearn.decomposition import PCA
import itertools
import json as jsonmodule
import os.path


def isNumeric(str):
	try: 
		float(str)
		return True
	except ValueError:
		return False


def initStructure(filename):
	#global filename,numHeader,separator
	possibleSeparators=[',' , ';' , '|', '\t']
	###Read first 2 lines
	f = open(filename, 'r')
	N = 2 # Number of lines to read
	xlines=[]
	for line in itertools.islice(f, N):
	    xlines.append(line.replace("\n", ""))
	
	###Find the separator
	numsep=0
	for possibleSeparator in possibleSeparators:
		numsep1=len(xlines[0].split(possibleSeparator))
		numsep2=len(xlines[1].split(possibleSeparator))
		#if separator in 2 first lines makes both rows equal length
		if (numsep1>numsep) & (numsep1==numsep2):
			separator=possibleSeparator
			numsep=numsep1

	###Guess if data has a header
	stringVals1=filter((lambda x: not(isNumeric(x)) ), xlines[0].split(separator)  )#filters string fields
	stringVals2=filter((lambda x: not(isNumeric(x)) ), xlines[1].split(separator)  )#filters string fields
	#if only all values in the first line (and not the second) are strings, we assume it has a header
	if (len(stringVals1)==len(xlines[0].split(separator))  &  len(stringVals1)!=len(stringVals2) ):
		numHeader=0 #It as header
	else:
		numHeader=-1 #It as no header
	data=pd.read_table(filename,sep=separator,header=numHeader);
	#print data
	return data;



def summaryData(filename):
	data=initStructure(filename)
	if (data.empty):
		print "No data"
		return jsonmodule.dumps({})
	else:
		#Summary of the data
		summary = data.describe()
		#Get summary properties
		vmax = summary.ix['max',:]
		vmin = summary.ix['min',:]
		vmedian= summary.ix['50%',:]
		vq25 = summary.ix['25%',:]
		vq75 = summary.ix['75%',:]
		#From values to json
		ncols=data.shape[1]
		colNames=data.columns.values
		mjson = {}
		for i in range(0, ncols):
			mjson[colNames[i]]={"min":vmin[i],"max":vmax[i],"median":vmedian[i],"q1":vq25[i],"q3":vq75[i]}
		#return the result
		#return jsonmodule.dumps(mjson)
		return mjson



##### FUNCTIONS TO CREATE THE PCA ######

def doPCA(filename):
	data=initStructure(filename)
	data=data.transpose()#In order to do PCA of rows
	df = pd.DataFrame(data)
	pca = PCA(n_components=2)
	pca.fit(df)
	xrow=pca.components_ [0]
	yrow=pca.components_ [1]
	#print xrow
	#print yrow
	xrow=(xrow+abs(min(xrow))).tolist() #All values above 0
	yrow=(yrow+abs(min(yrow))).tolist()
	pcaJson={'x':xrow,'y':yrow}
	return pcaJson




##### FUNCTIONS TO LAUNCH THE WEBPAGE ######

def executeWeb(functionToExecute,param,htmlToShow):
	newTab = 2 # open in a new tab, if possible
	webbrowser.open(htmlToShow,new=newTab)
	class executeWebR(Resource):
	    def get(self):
			return functionToExecute(param)
	api.add_resource(executeWebR, '/')
	if __name__ == '__main__':
		app.run()




##### MAIN ######

import sys

def main():
	if (len(sys.argv)<3):
		print "Name of function [summary,pca] and path of file are required"
	else:
		functName= None or sys.argv[1]
		filename = '' or sys.argv[2]
		if not(os.path.isfile(filename)):
			print "The file "+filename+" does not exist"
		#Execute different options
		if (functName=="summary"):
			web="front/summary.html"
			executeWeb(summaryData,filename,web)
		elif (functName=="pca"):
			web="front/pca.html"
			executeWeb(doPCA,filename,web)
		else:
			print "This function does not exist. Select [summary,pca]"


if __name__ == '__main__':
  main()