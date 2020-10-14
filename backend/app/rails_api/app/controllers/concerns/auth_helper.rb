module AuthHelper
    def getToken(headers)
        headers["Authorization"].sub("Bearer ", '')
    end

    def checkAccessToken(id, headers)
        if user = User.find_by(id: id)
            token = getToken(headers)
            return user if user.token == User.digest(token)
        end
    end
end