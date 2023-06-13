rm -f ./klarna-daytwo.zip
zip \
    --recurse-paths ./klarna-daytwo.zip ./ -x ./node_modules/\* -x ./client/node_modules/\* \
    --exclude "*.lock" "*.xml" ".gitignore" "*.zip" ".git/**/*" ".git/*" ".DS_Store" "*.sh" ".env"
