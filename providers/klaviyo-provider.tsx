"use client";

import Script from "next/script";

export default function KlaviyoProvider() {
  return (
    <>
      <Script
        src="https://static.klaviyo.com/onsite/js/XbeSEH/klaviyo.js?company_id=XbeSEH"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("Klaviyo script loaded");
        }}
      />

      <Script id="klaviyo-init" strategy="afterInteractive">
        {`
          !function(){
            if(!window.klaviyo){
              window._klOnsite=window._klOnsite||[];
              try{
                window.klaviyo=new Proxy({},{get:function(n,i){
                  return i==="push"
                    ? function(){window._klOnsite.push.apply(window._klOnsite,arguments)}
                    : function(){
                        var o=arguments,t=o[o.length-1],e=typeof t==="function"?t:null;
                        return new Promise(function(n){
                          window._klOnsite.push([i].concat([].slice.call(o,0,e?o.length-1:o.length),[function(i){
                            e&&e(i);n(i)
                          }]))
                        })
                      }
                }})
              }catch(n){
                window.klaviyo=window.klaviyo||[];
                window.klaviyo.push=function(){
                  window._klOnsite.push.apply(window._klOnsite,arguments)
                }
              }
            }
          }();
        `}
      </Script>
    </>
  );
}
