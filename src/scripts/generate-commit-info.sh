#!/bin/bash
# Crea un archivo en scripts/generate-commit-info.sh

# Obtiene el último mensaje de commit
COMMIT_MSG=$(git log -1 --pretty=%B)
COMMIT_DATE=$(git log -1 --pretty=%cd --date=short)

# Crea un archivo JSON con esta información
echo "{
  \"message\": \"${COMMIT_MSG}\",
  \"date\": \"${COMMIT_DATE}\",
  \"version\": \"1.0.0\"
}" > src/commit-info.json