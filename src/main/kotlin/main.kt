/*
 * Copyright (c) 2020 by PROS, Inc.  All Rights Reserved.
 * This software is the confidential and proprietary information of
 * PROS, Inc. ("Confidential Information").
 * You may not disclose such Confidential Information, and may only
 * use such Confidential Information in accordance with the terms of
 * the license agreement you entered into with PROS.
 */

import kotlinx.browser.document
import react.dom.render

fun main() {
    render(document.getElementById("root")) {
        child(App::class) {}
    }
}
