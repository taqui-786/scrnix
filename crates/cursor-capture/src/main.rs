use scap_targets::Display;
use scrinx_cursor_capture::RawCursorPosition;

fn main() {
    loop {
        let position = RawCursorPosition::get()
            .relative_to_display(Display::list()[1])
            .unwrap()
            .normalize();

        println!("{position:?}");
    }
}
