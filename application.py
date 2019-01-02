import math, sys
from flask import Flask, request, send_from_directory

# Build the trie structure out of the words in the dictionary.txt file.

trie = dict()
with open('dictionary.txt') as fin:
    print('loading dictionary.txt')
    for line in fin:
        word = line.strip().lower()
        if len(word) < 3:
            continue
        node = trie
        for ch in word:
            if ch.isalpha():
                if not ch in node:
                    node[ch] = dict()
                node = node[ch]
        if node != trie:
            node['wordflag'] = True


def isWord(word):
    '''
    Returns true if the given word is in the trie, false if the path
    represented by word is there but is not a full word, and None if the path
    is not there at all.
    '''
    word = word.strip().lower()
    node = trie
    for ch in word:
        if not ch in node:
            return None
        node = node[ch]
        
    return 'wordflag' in node


def addNode(x, y, rowLen, nodeList, path):
    '''
    Adds the node represented by x and y to the provided list (nodeList) if it
    is a valid coordiate based on rowLen.  The node cannot alreay be in the
    provided path, and the node will be added to the end of the provided path.
    '''
    if x >= 0 and y >= 0 and x < rowLen and y < rowLen:
        node = (x, y)
        if not node in path:
            nodeList.append(path + [node])

            
def findWords(puzzle):
    '''
    Returns a list of words that can be found in the provided puzzle.  The
    puzzle should be an N by N square of valid letters.
    '''
    rowLen = len(puzzle)
    words = set()
    toVisit = list()

    for i in range(0, rowLen):
        for j in range(0, rowLen):
            startNode = (i, j)
            toVisit.append([startNode])
    
    while len(toVisit) > 0:
        path = toVisit.pop(0)
        word = ''
        for x, y in path:
            word += puzzle[x][y]

        foundWord = isWord(word)
        if foundWord is None:
            continue
        
        if len(path) > 2 and foundWord:
            words.add(word)

        x, y = path[len(path) - 1]
        
        addNode(x - 1, y - 1, rowLen, toVisit, path);
        addNode(x - 1, y, rowLen, toVisit, path);
        addNode(x - 1, y + 1, rowLen, toVisit, path);
        addNode(x, y - 1, rowLen, toVisit, path);
        addNode(x, y + 1, rowLen, toVisit, path);
        addNode(x + 1, y - 1, rowLen, toVisit, path);
        addNode(x + 1, y, rowLen, toVisit, path);
        addNode(x + 1, y + 1, rowLen, toVisit, path);

    result = list(words)
    result.sort()
    return result

# Create the flask application and set up routes to /boggle to serve the main
# application page, and /boggle/solver to retrieve solutions to a given puzzle.

application = Flask(__name__)

@application.route('/boggle')
def index():
    return send_from_directory('static', 'index.html')


@application.route('/boggle/solver')
def solver():
    # puzzle should be a query parameter containing the puzzle flattened out
    # into a one dimensional list of letters.
    if not 'puzzle' in request.args:
        return 'no puzzle parameter'
    
    letters = request.args['puzzle'].lower()
    rowLen = math.sqrt(len(letters))

    # validate that the puzzle contains a square with sides between 2 and 10.
    if not rowLen.is_integer() or rowLen < 2 or rowLen > 10:
        return 'invalid length of puzzle ' + len(letters)
    
    rowLen = int(rowLen)

    # convert the flattened puzzle into a square grid to make searching easier.
    puzzle = [letters[(x*rowLen):(x*rowLen)+rowLen] for x in range(0, rowLen)]
    
    words = findWords(puzzle)

    return '\n'.join(words)


if __name__ == "__main__":
    application.run()
