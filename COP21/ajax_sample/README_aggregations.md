Agregation data from ES
=======================

Data was provided through 'weekly' aggregation by Maz on the tweets about climate change

Data was filtered later with the list of keywords from the gexf labels thanks to script in tools subdir.


```
python3 tools/filter_and_agg.py \
                  -i Weekly_ClimateChange_unfiltered_new_original_2016-06-10.json \
                  -d data/ClimateChange \
      > Weekly_ClimateChange_filtered_2016-06-10.json
```

```
   # found 504 labels in gexf file 'data/ClimateChange/ClimateChangeV1.gexf'
   # found 773 labels in gexf file 'data/ClimateChange/Climate Change 800 Main Map.gexf'
   # found 790 labels in gexf file 'data/ClimateChange/Maps_S_800.gexf'
   # master filter list has a total of 951 unique terms
   # filtering input json 'Weekly_ClimateChange_unfiltered_new_original_2016-06-10.json'
   # kept 40506/86269 "keyword buckets" across 63 "time buckets"
   # writing output json to STDOUT
```


And then simply link the new file to the expected filename for tina:

```
ln -s Weekly_ClimateChange_filtered_2016-06-10.json  Climate_Change_Weekly.json
```

