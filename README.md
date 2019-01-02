# Boggle Solver

Simple web app implemented with flask to solve a user supplied boggle puzzle.

The flask app can be started from the command line on a local machine with "python application.py".  It can then be accessed from "localhost:5000/boggle".

The dictionary.txt file contains the dictionary for the word search formatted as a single word per line.  It can be swapped out with any similarly formatted file containing words from any language represented with UTF-8.

The puzzle supplied by the user and the dictionary will be treated as case insensitve, with the solution words provided in lower case.  Only valid letters will be considered (i.e. punctionation is ignored).
