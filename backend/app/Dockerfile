FROM ruby:2.6.3
RUN apt-get update -qq && apt-get install -y nodejs
RUN apt-get -y install imagemagick
COPY ./rails_api/Gemfile /app/Gemfile
COPY ./rails_api/Gemfile.lock /app/Gemfile.lock
RUN gem install bundler:2.1.4
WORKDIR /app
RUN bundle install
COPY ./rails_api/ /app
COPY ./rails_api/start.sh /
RUN chmod 744 /start.sh
EXPOSE 3030
CMD ["/start.sh"]