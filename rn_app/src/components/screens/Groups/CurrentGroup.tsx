import React from 'react';
import {ScrollView} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {MemberImages} from '~/components/utils/MemberImages';

export const CurrentGroup = React.memo(() => {
  const {bottom} = useSafeAreaInsets();

  return (
    <ScrollView contentContainerStyle={{paddingBottom: bottom}}>
      <MemberImages memberImages={urls} containerStyle={{paddingTop: 10}} />
    </ScrollView>
  );
});

const urls = [
  'https://scontent-nrt1-1.cdninstagram.com/v/t51.2885-15/e35/85175462_176285990335210_4065743884077831252_n.jpg?_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_cat=110&_nc_ohc=_-nO9KpDp2kAX81jfcc&edm=AP_V10EBAAAA&ccb=7-4&oh=925f32b5ab171c424f5b2f3c7a36d062&oe=614C3791&_nc_sid=4f375e',
  'https://scontent-nrt1-1.cdninstagram.com/v/t51.2885-15/e35/s1080x1080/228569103_160333409558923_2070089261260133837_n.jpg?_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_cat=107&_nc_ohc=3v_klMRZDZcAX880FRN&edm=AP_V10EBAAAA&ccb=7-4&oh=ffc62f16085e0db0097f8d5351c8ce10&oe=614CD158&_nc_sid=4f375e',
  'https://scontent-nrt1-1.cdninstagram.com/v/t51.2885-15/e35/s1080x1080/211801284_232471811871535_5566055724391108557_n.jpg?_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_cat=107&_nc_ohc=riHJS_Kx6mUAX-gUU-C&edm=AP_V10EBAAAA&ccb=7-4&oh=de6024cfc98ee8b89f7f779333e1ae6b&oe=614BECA8&_nc_sid=4f375es',
  'https://scontent-nrt1-1.cdninstagram.com/v/t51.2885-15/e35/s1080x1080/242053123_1209879256106281_2975233896279402826_n.jpg?_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_cat=101&_nc_ohc=BKbi5sQblzEAX9W-Fnq&edm=AP_V10EBAAAA&ccb=7-4&oh=94cdf9d16f38f86fe979a32ae9999b39&oe=614C2C88&_nc_sid=4f375e',
  'https://scontent-nrt1-1.cdninstagram.com/v/t51.2885-15/e35/156665231_185401706380536_3138561747987160329_n.jpg?_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_cat=100&_nc_ohc=LHt9FnIEEXsAX_sHzHS&edm=AP_V10EBAAAA&ccb=7-4&oh=6c90ca5f217975f1e3ca5e235bf95259&oe=614B809D&_nc_sid=4f375e',
  'https://scontent-nrt1-1.cdninstagram.com/v/t51.2885-15/e35/85175462_176285990335210_4065743884077831252_n.jpg?_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_cat=110&_nc_ohc=_-nO9KpDp2kAX81jfcc&edm=AP_V10EBAAAA&ccb=7-4&oh=925f32b5ab171c424f5b2f3c7a36d062&oe=614C3791&_nc_sid=4f375e',
  null,
  'https://scontent-nrt1-1.cdninstagram.com/v/t51.2885-15/e35/s1080x1080/228569103_160333409558923_2070089261260133837_n.jpg?_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_cat=107&_nc_ohc=3v_klMRZDZcAX880FRN&edm=AP_V10EBAAAA&ccb=7-4&oh=ffc62f16085e0db0097f8d5351c8ce10&oe=614CD158&_nc_sid=4f375e',
  'https://scontent-nrt1-1.cdninstagram.com/v/t51.2885-15/e35/s1080x1080/211801284_232471811871535_5566055724391108557_n.jpg?_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_cat=107&_nc_ohc=riHJS_Kx6mUAX-gUU-C&edm=AP_V10EBAAAA&ccb=7-4&oh=de6024cfc98ee8b89f7f779333e1ae6b&oe=614BECA8&_nc_sid=4f375es',
  'https://scontent-nrt1-1.cdninstagram.com/v/t51.2885-15/e35/s1080x1080/242053123_1209879256106281_2975233896279402826_n.jpg?_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_cat=101&_nc_ohc=BKbi5sQblzEAX9W-Fnq&edm=AP_V10EBAAAA&ccb=7-4&oh=94cdf9d16f38f86fe979a32ae9999b39&oe=614C2C88&_nc_sid=4f375e',
  'https://scontent-nrt1-1.cdninstagram.com/v/t51.2885-15/e35/156665231_185401706380536_3138561747987160329_n.jpg?_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_cat=100&_nc_ohc=LHt9FnIEEXsAX_sHzHS&edm=AP_V10EBAAAA&ccb=7-4&oh=6c90ca5f217975f1e3ca5e235bf95259&oe=614B809D&_nc_sid=4f375e',
  'https://scontent-nrt1-1.cdninstagram.com/v/t51.2885-15/e35/85175462_176285990335210_4065743884077831252_n.jpg?_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_cat=110&_nc_ohc=_-nO9KpDp2kAX81jfcc&edm=AP_V10EBAAAA&ccb=7-4&oh=925f32b5ab171c424f5b2f3c7a36d062&oe=614C3791&_nc_sid=4f375e',
  'https://scontent-nrt1-1.cdninstagram.com/v/t51.2885-15/e35/s1080x1080/228569103_160333409558923_2070089261260133837_n.jpg?_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_cat=107&_nc_ohc=3v_klMRZDZcAX880FRN&edm=AP_V10EBAAAA&ccb=7-4&oh=ffc62f16085e0db0097f8d5351c8ce10&oe=614CD158&_nc_sid=4f375e',
  'https://scontent-nrt1-1.cdninstagram.com/v/t51.2885-15/e35/s1080x1080/211801284_232471811871535_5566055724391108557_n.jpg?_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_cat=107&_nc_ohc=riHJS_Kx6mUAX-gUU-C&edm=AP_V10EBAAAA&ccb=7-4&oh=de6024cfc98ee8b89f7f779333e1ae6b&oe=614BECA8&_nc_sid=4f375es',
  'https://scontent-nrt1-1.cdninstagram.com/v/t51.2885-15/e35/s1080x1080/242053123_1209879256106281_2975233896279402826_n.jpg?_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_cat=101&_nc_ohc=BKbi5sQblzEAX9W-Fnq&edm=AP_V10EBAAAA&ccb=7-4&oh=94cdf9d16f38f86fe979a32ae9999b39&oe=614C2C88&_nc_sid=4f375e',
  'https://scontent-nrt1-1.cdninstagram.com/v/t51.2885-15/e35/156665231_185401706380536_3138561747987160329_n.jpg?_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_cat=100&_nc_ohc=LHt9FnIEEXsAX_sHzHS&edm=AP_V10EBAAAA&ccb=7-4&oh=6c90ca5f217975f1e3ca5e235bf95259&oe=614B809D&_nc_sid=4f375e',
  'https://scontent-nrt1-1.cdninstagram.com/v/t51.2885-15/e35/85175462_176285990335210_4065743884077831252_n.jpg?_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_cat=110&_nc_ohc=_-nO9KpDp2kAX81jfcc&edm=AP_V10EBAAAA&ccb=7-4&oh=925f32b5ab171c424f5b2f3c7a36d062&oe=614C3791&_nc_sid=4f375e',
  null,
  'https://scontent-nrt1-1.cdninstagram.com/v/t51.2885-15/e35/s1080x1080/228569103_160333409558923_2070089261260133837_n.jpg?_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_cat=107&_nc_ohc=3v_klMRZDZcAX880FRN&edm=AP_V10EBAAAA&ccb=7-4&oh=ffc62f16085e0db0097f8d5351c8ce10&oe=614CD158&_nc_sid=4f375e',
  'https://scontent-nrt1-1.cdninstagram.com/v/t51.2885-15/e35/s1080x1080/211801284_232471811871535_5566055724391108557_n.jpg?_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_cat=107&_nc_ohc=riHJS_Kx6mUAX-gUU-C&edm=AP_V10EBAAAA&ccb=7-4&oh=de6024cfc98ee8b89f7f779333e1ae6b&oe=614BECA8&_nc_sid=4f375es',
  'https://scontent-nrt1-1.cdninstagram.com/v/t51.2885-15/e35/s1080x1080/242053123_1209879256106281_2975233896279402826_n.jpg?_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_cat=101&_nc_ohc=BKbi5sQblzEAX9W-Fnq&edm=AP_V10EBAAAA&ccb=7-4&oh=94cdf9d16f38f86fe979a32ae9999b39&oe=614C2C88&_nc_sid=4f375e',
  'https://scontent-nrt1-1.cdninstagram.com/v/t51.2885-15/e35/156665231_185401706380536_3138561747987160329_n.jpg?_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_cat=100&_nc_ohc=LHt9FnIEEXsAX_sHzHS&edm=AP_V10EBAAAA&ccb=7-4&oh=6c90ca5f217975f1e3ca5e235bf95259&oe=614B809D&_nc_sid=4f375e',
  'https://scontent-nrt1-1.cdninstagram.com/v/t51.2885-15/e35/85175462_176285990335210_4065743884077831252_n.jpg?_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_cat=110&_nc_ohc=_-nO9KpDp2kAX81jfcc&edm=AP_V10EBAAAA&ccb=7-4&oh=925f32b5ab171c424f5b2f3c7a36d062&oe=614C3791&_nc_sid=4f375e',
  'https://scontent-nrt1-1.cdninstagram.com/v/t51.2885-15/e35/s1080x1080/228569103_160333409558923_2070089261260133837_n.jpg?_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_cat=107&_nc_ohc=3v_klMRZDZcAX880FRN&edm=AP_V10EBAAAA&ccb=7-4&oh=ffc62f16085e0db0097f8d5351c8ce10&oe=614CD158&_nc_sid=4f375e',
  'https://scontent-nrt1-1.cdninstagram.com/v/t51.2885-15/e35/s1080x1080/211801284_232471811871535_5566055724391108557_n.jpg?_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_cat=107&_nc_ohc=riHJS_Kx6mUAX-gUU-C&edm=AP_V10EBAAAA&ccb=7-4&oh=de6024cfc98ee8b89f7f779333e1ae6b&oe=614BECA8&_nc_sid=4f375es',
  'https://scontent-nrt1-1.cdninstagram.com/v/t51.2885-15/e35/s1080x1080/242053123_1209879256106281_2975233896279402826_n.jpg?_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_cat=101&_nc_ohc=BKbi5sQblzEAX9W-Fnq&edm=AP_V10EBAAAA&ccb=7-4&oh=94cdf9d16f38f86fe979a32ae9999b39&oe=614C2C88&_nc_sid=4f375e',
  'https://scontent-nrt1-1.cdninstagram.com/v/t51.2885-15/e35/156665231_185401706380536_3138561747987160329_n.jpg?_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_cat=100&_nc_ohc=LHt9FnIEEXsAX_sHzHS&edm=AP_V10EBAAAA&ccb=7-4&oh=6c90ca5f217975f1e3ca5e235bf95259&oe=614B809D&_nc_sid=4f375e',
  'https://scontent-nrt1-1.cdninstagram.com/v/t51.2885-15/e35/85175462_176285990335210_4065743884077831252_n.jpg?_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_cat=110&_nc_ohc=_-nO9KpDp2kAX81jfcc&edm=AP_V10EBAAAA&ccb=7-4&oh=925f32b5ab171c424f5b2f3c7a36d062&oe=614C3791&_nc_sid=4f375e',
  null,
  'https://scontent-nrt1-1.cdninstagram.com/v/t51.2885-15/e35/s1080x1080/228569103_160333409558923_2070089261260133837_n.jpg?_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_cat=107&_nc_ohc=3v_klMRZDZcAX880FRN&edm=AP_V10EBAAAA&ccb=7-4&oh=ffc62f16085e0db0097f8d5351c8ce10&oe=614CD158&_nc_sid=4f375e',
  'https://scontent-nrt1-1.cdninstagram.com/v/t51.2885-15/e35/s1080x1080/211801284_232471811871535_5566055724391108557_n.jpg?_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_cat=107&_nc_ohc=riHJS_Kx6mUAX-gUU-C&edm=AP_V10EBAAAA&ccb=7-4&oh=de6024cfc98ee8b89f7f779333e1ae6b&oe=614BECA8&_nc_sid=4f375es',
  'https://scontent-nrt1-1.cdninstagram.com/v/t51.2885-15/e35/s1080x1080/242053123_1209879256106281_2975233896279402826_n.jpg?_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_cat=101&_nc_ohc=BKbi5sQblzEAX9W-Fnq&edm=AP_V10EBAAAA&ccb=7-4&oh=94cdf9d16f38f86fe979a32ae9999b39&oe=614C2C88&_nc_sid=4f375e',
  'https://scontent-nrt1-1.cdninstagram.com/v/t51.2885-15/e35/156665231_185401706380536_3138561747987160329_n.jpg?_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_cat=100&_nc_ohc=LHt9FnIEEXsAX_sHzHS&edm=AP_V10EBAAAA&ccb=7-4&oh=6c90ca5f217975f1e3ca5e235bf95259&oe=614B809D&_nc_sid=4f375e',
  'https://scontent-nrt1-1.cdninstagram.com/v/t51.2885-15/e35/85175462_176285990335210_4065743884077831252_n.jpg?_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_cat=110&_nc_ohc=_-nO9KpDp2kAX81jfcc&edm=AP_V10EBAAAA&ccb=7-4&oh=925f32b5ab171c424f5b2f3c7a36d062&oe=614C3791&_nc_sid=4f375e',
  'https://scontent-nrt1-1.cdninstagram.com/v/t51.2885-15/e35/s1080x1080/228569103_160333409558923_2070089261260133837_n.jpg?_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_cat=107&_nc_ohc=3v_klMRZDZcAX880FRN&edm=AP_V10EBAAAA&ccb=7-4&oh=ffc62f16085e0db0097f8d5351c8ce10&oe=614CD158&_nc_sid=4f375e',
  'https://scontent-nrt1-1.cdninstagram.com/v/t51.2885-15/e35/s1080x1080/211801284_232471811871535_5566055724391108557_n.jpg?_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_cat=107&_nc_ohc=riHJS_Kx6mUAX-gUU-C&edm=AP_V10EBAAAA&ccb=7-4&oh=de6024cfc98ee8b89f7f779333e1ae6b&oe=614BECA8&_nc_sid=4f375es',
  'https://scontent-nrt1-1.cdninstagram.com/v/t51.2885-15/e35/s1080x1080/242053123_1209879256106281_2975233896279402826_n.jpg?_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_cat=101&_nc_ohc=BKbi5sQblzEAX9W-Fnq&edm=AP_V10EBAAAA&ccb=7-4&oh=94cdf9d16f38f86fe979a32ae9999b39&oe=614C2C88&_nc_sid=4f375e',
  'https://scontent-nrt1-1.cdninstagram.com/v/t51.2885-15/e35/156665231_185401706380536_3138561747987160329_n.jpg?_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_cat=100&_nc_ohc=LHt9FnIEEXsAX_sHzHS&edm=AP_V10EBAAAA&ccb=7-4&oh=6c90ca5f217975f1e3ca5e235bf95259&oe=614B809D&_nc_sid=4f375e',
  'https://scontent-nrt1-1.cdninstagram.com/v/t51.2885-15/e35/85175462_176285990335210_4065743884077831252_n.jpg?_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_cat=110&_nc_ohc=_-nO9KpDp2kAX81jfcc&edm=AP_V10EBAAAA&ccb=7-4&oh=925f32b5ab171c424f5b2f3c7a36d062&oe=614C3791&_nc_sid=4f375e',
  null,
  'https://scontent-nrt1-1.cdninstagram.com/v/t51.2885-15/e35/s1080x1080/228569103_160333409558923_2070089261260133837_n.jpg?_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_cat=107&_nc_ohc=3v_klMRZDZcAX880FRN&edm=AP_V10EBAAAA&ccb=7-4&oh=ffc62f16085e0db0097f8d5351c8ce10&oe=614CD158&_nc_sid=4f375e',
  'https://scontent-nrt1-1.cdninstagram.com/v/t51.2885-15/e35/s1080x1080/211801284_232471811871535_5566055724391108557_n.jpg?_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_cat=107&_nc_ohc=riHJS_Kx6mUAX-gUU-C&edm=AP_V10EBAAAA&ccb=7-4&oh=de6024cfc98ee8b89f7f779333e1ae6b&oe=614BECA8&_nc_sid=4f375es',
];
