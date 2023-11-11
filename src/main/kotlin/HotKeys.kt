@file:JsModule("react-hotkeys")
@file:JsNonModule

import react.RClass
import react.RProps

@JsName("HotKeys")
external val hotKeys: RClass<HotKeysProps>

external interface HotKeysProps : RProps {
    var keyMap: MyKey
    var handlers: MyHandler
}
