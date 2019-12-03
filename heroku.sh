git add db/* public/* package* webpack* src/*; 
git commit -m "update app front-end"; 
git push heroku master; 
heroku addons:create mongolab; 
heroku restart