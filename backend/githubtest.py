from github import Auth
from github import Github

#auth = Auth.Login(user_login, password)
secret = ""
g = Github(secret)
#g.get_user().login

#user = g.get_user()
#print(g.get_user(user.login).name)

# org = g.get_organization(user.login)
# print(org)

# repositories = g.search_repositories(query='language:python')
# for repo in repositories:
#     print(repo)

#These work only for authenticated user. 
def get_repoStats() :
  repo = g.get_repo("kewalkishang/Unity-UML-Generator")
  contents = repo.get_labels()       
  contents = repo.get_top_referrers()
  contents = repo.get_top_paths()
  contents = repo.get_views_traffic()

# for repo in g.get_user().get_repos():
#    print(repo.name)
  #org = g.get_organization("PyGithub)
    #print(repo.get_topics())
    #print(repo.stargazers_count)
    # for label in repo.get_labels():
    #     print(label)
    #contents = repo.get_top_referrers()
    #contents = repo.get_top_paths()
   # contents = repo.get_views_traffic()
    #contents = repo.get_clones_traffic()
    #list(repo.get_branches())
   # print(contents)



    # repo.edit(has_wiki=False)
    # to see all the available attributes and methods
    #print(dir(repo))



# curl -L \
#   -H "Accept: application/vnd.github+json" \
#   -H "Authorization: Bearer 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" \
#   -H "X-GitHub-Api-Version: 2022-11-28" \
#   https://api.github.com/users/kewalkishang


# curl -L \
#   -H "Accept: application/vnd.github+json" \
#   -H "Authorization: Bearer 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" \
#   -H "X-GitHub-Api-Version: 2022-11-28" \
#   https://api.github.com/users/DarshanGowda0/repos