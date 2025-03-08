# Simple Digital Clock in C

This program creates a simple digital clock that continuously updates and displays the current time in HH:MM:SS format.

## Features

- User input: Allows the user to input the current time in HH:MM:SS format.
- Error handling: Ensures the input time is valid (within the range of 00:00:00 to 23:59:59).
- Continuous update: Updates and displays the time every second.
- Clear screen: Clears the screen before printing the updated time to create a smooth clock display.

## Usage

1. Compile the program using a C compiler. For example, with GCC, you can use the following command:
   ```
   gcc digital_clock.c -o digital_clock
   ```

2. Run the compiled executable:
   ```
   ./digital_clock
   ```

3. Enter the current time when prompted in HH:MM:SS format. For example:
   ```
   Please enter current time (in HH:MM:SS format):
   10:30:00
   ```

4. The program will continuously update and display the current time until terminated manually.

## Notes

- This program uses the `windows.h` library for the `Sleep` function and `system("cls")` command. If you're using a different operating system, you may need to adjust these parts of the code for compatibility.

---

