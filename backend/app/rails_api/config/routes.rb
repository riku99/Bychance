Rails.application.routes.draw do
  namespace 'api' do
    namespace 'v1' do
      post '/firstLogin', to: 'users#firstLogin'
      post '/subsequentLogin', to: 'users#subsequentLogin'
      post '/nonce', to: 'users#createNonce'
      patch '/user', to: 'users#edit'
    end
  end
end
