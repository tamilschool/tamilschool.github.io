@file:JsModule("react-hotkeys")
@file:JsNonModule

import data.MyHandler
import data.MyKey
import react.RClass
import react.RProps

@JsName("HotKeys")
external val hotKeys: RClass<HotKeysProps>

external interface HotKeysProps : RProps {
    var keyMap: MyKey
    var handlers: MyHandler
}
