20.times do |n|
    crypt = User.create_geolocation_crypt
    User.create(uid: "seed#{n}", name: "sample_user#{n}", image: nil, introduce: "Hello!", message: "number#{n}", display: true, token: "sample#{n}", lat: crypt.encrypt_and_sign(35.6675773762208), lng: crypt.encrypt_and_sign(140.0197256425014))
end