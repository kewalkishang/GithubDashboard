import requests

# Set the GitHub API endpoint URL
url = 'https://api.github.com/users/{username}'

repo = 'https://api.github.com/users/{username}/repos'

# Set your GitHub username and personal access token
#username = 'kewalkishang'
#username = 'DarshanGowda0'
token = 'access_token_here'

# # Set the owner and repo values for the repository you want to access
# owner = 'repository_owner'
# repo = 'repository_name'

# Set headers including the authorization token


def get_userdata(username):
    headers = {
        'Authorization': f'Token {token}',
        'User-Agent': username
    }
    # Make the GET request
    response = requests.get(url.format(username=username), headers=headers)
    return response


def get_repodata(username):
    print("Hello from a function")
    # Make the GET request
    headers = {
        'Authorization': f'Token {token}',
        'User-Agent': username
    }
    response = requests.get(repo.format(username=username), headers=headers)

    # Check if the request was successful
    if response.status_code == 200:
        data = response.json()
        return data
        # Now you can work with the data from the response
        print(data)
    else:
        print(f"Request failed with status code: {response.status_code}")
        print(response.text)
        return response
