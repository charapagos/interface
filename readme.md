# git note

## git model

Local Repository:

- Repository (.git)
- Working (local directory)
- Stage (virtual tray)

Repository types

- Local: "name/.git"
- Remote(SSH): "git@github.com/user/reponame.git"

## Add Wroking Files to Repository

- Working to Stage: "git add ADDING_FILE DIRECTORY/"
- Stage to Repository: "git commit -m 'commit message'"

## Upload Local to Remote(github)

- Push Local to Remote: "git push origin master"
    - "origin" repository: copied repository with "git clone"
    - "master" branch: default branch
- Pull Remote to Local: "git pull origin master"

## Clone Repository

- "git clone git@github.com:charapagos/interface.git" 
- another name: git@github.com:charapagos/interface.git another_name"

