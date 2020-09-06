#!/bin/bash
bundle exec rails db:create
bundle exec rails db:migrate
exec bundle exec rails s -b 0.0.0.0 -p 3030