# Prezentator
---
## CZ:
Jednoduchý javascript kód který ukazuje seřazení prezentací na přednáškové místnosti a zobrazuje info o aktuálních přednáškách na přednáškových akcích.
Sestaven s `electron.js` a `electron-builder`.

### Installace
Stáhněte příslušný `.exe` nebo `.deb` z **Releases** tabu

### Použití
Po spuštění aplikace se zobrazí file dialog, který se vás zeptá jakej soubor s prezentacemi chcete přečíst. (**NOTE**: Aplikace bere pouze `.txt` soubory ve specifickém formátu)

**Formát `.txt` souboru**:

Příklad toho, jak by měl input soubor vypadat:
```
A: [example title 1A, name1, 16:00 - 27:30, example title 2A, name2, 18:30 - 19:00]
B: [example title 1B, name3, 18:00 - 19:00, example title 2B, John amogu, 19:10 - 20:00]
C: [example title 1C, name4, 18:00 - 18:15, example title 2C, name5, 18:30 - 20:30]
D: [example title 1D, name6, 18:00 - 18:45, example title 2D, name7, 18:45 - 22:00]
```
kde `example title XY` je nadpis, `name` je jméno, poté je čas přednášky. V hranatých závorkách se nacházejí přednášky pr přesně danou místnost (A, B, C, D - taky se dá přejmenovat). Ty se nijak nerozdělují, navazují čárkami hned za sebe.

Toť vše :)

## EN:

A simple javascript code which shows an arrangement of the presentations and some info about them (like location, time, etc.) on pitching and presentation events.
Built with `electron.js` and `electron-builder`.

### Installation
Install the latest `.exe` or `.deb` file from **Releases** tab.

### Usage
After app startup, a file dialog will pop-up, which will ask you to select your presentations file (**NOTE**: Dialog can accept only `.txt` files with specific formatting)

**Formatting of the `.txt` file**:
An example, how the input file should look like:
```
A: [example title 1A, name1, 16:00 - 27:30, example title 2A, name2, 18:30 - 19:00]
B: [example title 1B, name3, 18:00 - 19:00, example title 2B, John amogu, 19:10 - 20:00]
C: [example title 1C, name4, 18:00 - 18:15, example title 2C, name5, 18:30 - 20:30]
D: [example title 1D, name6, 18:00 - 18:45, example title 2D, name7, 18:45 - 22:00]
```
where `example title XY` is an title of a presentation, `name` is a name of the author of the presentation, next is the start time and end time. In the square brackets are the presentations for specific room (A, B, C, D - you can also change these names). Presentations are not specially divided, they are divided by the commas just like the rest of the parameters.

Thats all :)
