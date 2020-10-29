module AuthHelper
  def getToken(headers)
    headers['Authorization'].sub('Bearer ', '')
  end
end
