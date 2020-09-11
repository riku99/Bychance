Rails.application.routes.draw do
  namespace 'api' do
    namespace 'v1' do
      post '/firstLogin', to: 'users#firstLogin'
      post '/subsequentLogin', to: 'users#subsequentLogin'
      post '/nonce', to: 'users#createNonce'
    end
  end
end
