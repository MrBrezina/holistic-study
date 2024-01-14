# Study of holistic component in letter perception


# Study of holistic component in letter perception

Designed and conducted by: David Březina and Mary Dyson

This repo contains materials for a study we have conducted in the first half of 2022 to address the question whether people can selectively attend to the top halves of letters and ignore the bottom halves

[![CC BY-SA 4.0][cc-by-sa-shield]][cc-by-sa]

This work is licensed under a
[Creative Commons Attribution-ShareAlike 4.0 International License][cc-by-sa].

The fonts are available under a [proprietary licence of Rosetta Type Foundry)(https://rosettatype.com/licence). If you wish to use them, request express permission from Rosetta via email.

[cc-by-sa]: http://creativecommons.org/licenses/by-sa/4.0/
[cc-by-sa-shield]: https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey.svg

## Study report

We described the study and some of the results in a conference presentation at the [ICTVC 8 conference](https://ictvc.org/2022/en/) conference in Thessaloniki in July 2022. Find brief report about the study on Design Regression mini-journal:

- [Can we selectively attend to the top halves of letters and ignore the bottom halves?](https://designregression.com/article/can-we-selectively-attend-to-the-top-halves-of-letters-and-ignore-the-bottom-halves)

## Contents of this repo

This repo includes:

- the fonts used
- the website we used to collect participants’ responses
- the data/responses collected
- Jupyter notebooks used to process the data and provide descriptive statistics

We have used other software to analyze the data.

### Font

The Holicissimo fonts used to create the samples.

### Website

The website was served using GitHub Pages directly from this repo. The code is saved in `website/`. You can preview it by visiting [https://mrbrezina.github.io/holistic-study/](https://mrbrezina.github.io/holistic-study/) (the responses will not get saved).

The website uses Javascript to navigate between and time inidividual steps of the study and request responses from participants. The responses from each participant were saved using a [GetForm](https://getform.io) service.

The samples (letter shapes created by combining top and bottom halves of letters from a variable font) are generated using a Python script (see `samples/generate-samples.py`).

We tried to obtain results from Greek participants (participants whose L1 is Greek), but collected only a small number of responses. The slightly modified version of the website is in `website/greek-version/`.

### Data

The “raw“ data collected from the website (via GetForm) before any processing is saved in the `data/raw-data.csv` file. The processed data is stored in `data/serial-data.csv` and `data/aggregated-data.csv`. For description of the data format, see the [data-processing notebook](https://nbviewer.jupyter.org/github/MrBrezina/holistic-study/blob/master/notebooks/1%20Process%20raw%20data.ipynb).

The data from Greek participants is saved in saved in the `data/raw-data_greek.csv` file.

### Jupyter notebooks

Jupyter notebooks used to process and analyze the data are stored in the `notebooks/` folder.

- `notebooks/1 Process raw data.ipynb` [View using NBViewer](https://nbviewer.jupyter.org/github/MrBrezina/holistic-study/blob/master/notebooks/1%20Process%20raw%20data.ipynb)
- `notebooks/2 Descriptive statistics.ipynb` [View using NBViewer](https://nbviewer.jupyter.org/github/MrBrezina/holistic-study/blob/master/notebooks/2%20Descriptive%20statistics.ipynb)

