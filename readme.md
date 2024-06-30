# ppm parsonal configrations

個人的なppmの設定集です。  
利用や改変はかまいせんがプラグインとしてのサポートや動作の保証はできません。

## Key Setting Mode

1-8キーに任意のジャンプパスを割り当てるモード設定です。  
switchmenuの`0:Create new menu`に`KeySetMode`というメニュー項目を作り、  
以下の設定をコピーすれば使えます。  
使い方はモードを起動し、割り当てたいパスに移動したあと`Ctrl+<1-8>`を入力。  
`9`キーには自動で`S_ppm#user:fo_trash\deleted$`が割り当てられます。

```text
/restart  = *execute ,%%M_ppmSwitch,"?c:%*getcust(S_ppm#user:sw_check);%*getcust(S_ppm#user:sw_cursor)"
/setcursor  = *setcust S_ppm#user:sw_cursor
/setcheck  = *setcust S_ppm#user:sw_check
/trash  = %*getcust(S_ppm#user:fo_trash)\deleted$

&n:KeySetMode = *string o,cback=H401010
 *ifmatch %so"cback",%*getcust(C_back)%:*stop
 [/setcursor]=終了%btEsc
 [/setcheck]=2
 *setcust @%sgu'ppmcache'\switchmenu\keyset.cfg
 *setcust KC_main:9,%%j"[/trash]"
 *linemessage SetKey:9=[/trash]
 *string p,tempBg=%*getcust(C_back)
 *customize C_back=%so"cback"
 *mapkey use,K_ppmSwitchKey
 [/restart]
```
