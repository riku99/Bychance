20.times do |n|
    crypt = User.create_geolocation_crypt
    User.create(uid: "seed#{n}", name: "sample_user#{n}", image: nil, introduce: "Hello!", message: "number#{n}", display: true, token: "sample#{n}", lat: crypt.encrypt_and_sign(35.6486), lng: crypt.encrypt_and_sign(140.042))
end