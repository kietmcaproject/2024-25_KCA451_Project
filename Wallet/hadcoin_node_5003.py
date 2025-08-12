import datetime
import hashlib
import json
from flask import Flask, jsonify, request
import requests
from uuid import uuid4
#uuid is used to genrate random addresses
#here we use uuid for generating addresses for nodes
from urllib.parse import urlparse

class Blockchain:
    def __init__(self):
        self.chain = []
        self.transactions = []
        self.create_block(proof=1, previous_hash='0')
        self.nodes = set()
    	#Using a set ensures that there are no duplicate nodes.
        #If a node is added multiple times, it will only be stored once.

    def create_block(self, proof, previous_hash):
        block = {
            'index': len(self.chain) + 1,
            'timestamp': str(datetime.datetime.now()),
            'proof': proof,
            'previous_hash': previous_hash,
            'transactions': self.transactions
        }
        self.transactions = []
        self.chain.append(block)
        return block

    def get_previous_block(self):
        return self.chain[-1]

    def proof_of_work(self, previous_proof):
        new_proof = 1
        check_proof = False
        while check_proof is False:
            hash_operation = hashlib.sha256(str(new_proof**2 - previous_proof**2).encode()).hexdigest()
            if hash_operation[:4] == '0000':
                check_proof = True
            else:
                new_proof += 1
        return new_proof

    def hash(self, block):
        encoded_block = json.dumps(block, sort_keys=True).encode()
        return hashlib.sha256(encoded_block).hexdigest()

    def is_chain_valid(self, chain):
        previous_block = chain[0]
        block_index = 1
        while block_index < len(chain):
            block = chain[block_index]
            if block['previous_hash'] != self.hash(previous_block):
                return False
            previous_proof = previous_block['proof']
            proof = block['proof']
            hash_operation = hashlib.sha256(str(proof**2 - previous_proof**2).encode()).hexdigest()
            if hash_operation[:4] != '0000':
                return False
            previous_block = block
            block_index += 1
        return True
    
    def add_transaction(self, sender, receiver, amount):
        self.transactions.append({'sender': sender,
                                  'receiver': receiver,
                                  'amount': amount
                                 })
        previous_block = self.get_previous_block()
        return previous_block['index']+1
    #because the transactions are added into the new block 
    #which is found by adding 1 to previous block's index
    
    def add_node(self, address):
        parsed_url = urlparse(address)
        self.nodes.add(parsed_url.netloc)
        
        def replace_chain(self):
            network = self.nodes
            longest_chain = None
            max_length = len(self.chain)
            for node in network:
                response = requests.get(f'http://{node}/get_chain')
                if response.status_code == 200:
                   length = response.json()['length']
                   chain = response.json()['chain']
                   if length > max_length and self.is_chain_valid(chain):
                       max_length = length
                       longest_chain = chain
            if longest_chain :
               self.chain = longest_chain
               return True
            return False
               
               
               
# Creating the Flask Web App
app = Flask(__name__)

#creating an address for node on port 5002
node_address = str(uuid4()).replace('-', '')


#creating a blockchain
blockchain = Blockchain() 

@app.route('/mine_block', methods=['GET'])
def mine_block():
    previous_block = blockchain.get_previous_block()
    previous_proof = previous_block['proof']
    proof = blockchain.proof_of_work(previous_proof)
    previous_hash = blockchain.hash(previous_block)
    blockchain.add_transaction(sender= node_address, receiver= 'Ajay', amount=15)
    block = blockchain.create_block(proof, previous_hash)
    
    response = {
        'message': 'Block mined successfully',     #block is a dictionary.we call each element from the block
        'index': block['index'],
        'timestamp': block['timestamp'],
        'proof': block['proof'],  # Fixed typo
        'previous_hash': block['previous_hash'],
        'transactions': block['transactions']
    }
    return jsonify(response), 200

@app.route('/get_chain', methods=['GET'])
def get_chain():
    response = {'chain': blockchain.chain, 'length': len(blockchain.chain)}
    return jsonify(response), 200


 
  
@app.route('/is_valid', methods=['GET'])
def is_valid():
    is_valid = blockchain.is_chain_valid(blockchain.chain)
    if is_valid:
        response = {'message' :'The chain is valid'}
    else:
        response = {'message' : 'The chain is not valid'}
    return jsonify(response), 200

#adding a transaction to our blockchain
@app.route('/add_transaction', methods=['POST'])
def add_transaction():
    json = request.get_json()
    transaction_keys = ['sender','receiver','amount']
    if not all (key in json for key in transaction_keys):
        return 'Some elements of this transaction are missing' , 400
    #400 is code for http bad request
    index = blockchain.add_transaction(json['sender'], json['receiver'], json['amount'])
    response = {'message' : f'This transaction will be added to the block {index}'}
    #f String is a method that replaces variable with its string value
    return response , 201
  #status code for success is 201


#Decentralizing


#connecting the new nodes

@app.route('/connect_node', methods=['POST'])
def connect_node():
    json = request.get_json()
    nodes = json.get('nodes')
    if nodes is None:
        return 'No node' , 400
    for nodes in nodes:
        blockchain.add_node(nodes)
    response = {'message' : 'All the nodes are now connected. This hadcoin blockchain now contains the following nodes:',
                'total nodes' : list(blockchain.nodes)}
    return jsonify(response), 201


#Selecting the longest chain
    
@app.route('/replace_chain', methods=['GET'])
def replace_chain():
    is_chain_replaced = blockchain.replace_chain()
    if is_chain_replaced:
        response = {'message' :'The chain was replaced',
                    'new_chain' : blockchain.chain}
    else:
        response = {'message' : 'The chain is not replaced',
                    'actual_chain' : blockchain.chain}  
    return jsonify(response), 200


# Running the Flask App
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5071, debug=True)







  