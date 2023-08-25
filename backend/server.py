# Import flask and datetime module for showing date and time
from flask import Flask, jsonify
import datetime
from flask_cors import CORS
import requestsAPI
 
x = datetime.datetime.now()
 
# Initializing flask app
app = Flask(__name__)
CORS(app)
 
# Route for seeing a data
@app.route('/data/<username>', methods=['GET'])
def get_user(username):
    user_data = requestsAPI.get_userdata(username)
    if user_data.status_code == 404 :
         user_data = "ERROR"
         return jsonify(status="404")
    #user_data = "hello"
    #print("get_user ", user_data) 
    data = user_data.json()
    data["status"] = 200
    return data
 
# Route for seeing a data
@app.route('/repo/<username>', methods=['GET'])
def get_repo(username):
    repo_data = requestsAPI.get_repodata(username)
    #print("repo_data ", repo_data ) 
    return repo_data

     
# Running app
if __name__ == '__main__':
    app.run(debug=True)