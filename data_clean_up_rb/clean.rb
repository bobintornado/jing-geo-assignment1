require 'json'
require 'smarter_csv'

data = SmarterCSV.process('clean_up_2014.csv')

mappings = {
  "0_-_4": "0_4",
  "5_-_9": "5_9",
  "10_-_14": "10_14",
  "15_-_19": "15_19",
  "20_-_24": "20_24",
  "25_-_29": "25_29",
  "30_-_34": "30_34",
  "35_-_39": "35_39",
  "40_-_44": "40_44",
  "45_-_49": "45_49",
  "50_-_54": "50_54",
  "55_-_59": "55_59",
  "60_-_64": "60_65",
  "65_&_over": "65_over"
}

# Change key name
for d in data
  # Convert to number
  d.keys.each { |k| d[k] = d[k].to_s.gsub(/,/, '').to_i if mappings[k] }
	# Change Name
	d.keys.each { |k| d[ mappings[k] ] = d.delete(k) if mappings[k] }
end

# slice in to three files
total = Array.new
males = Array.new
females = Array.new

for d in data
	if d[:total] == "Males (Number)"
		sp1 = data.index(d)
		total = data.slice(1..sp1-8)
	end
	if d[:total] == "Females (Number)"
		sp2 = data.index(d)
		males = data.slice(sp1+1..sp2-8)
		ep = data.length-1
		females = data.slice(sp2+1..ep-5)
	end
end

def convert_total(array)
  for d in array 
    d.keys.each { |k| d[k] = d[k].to_s.gsub(/,/, '').to_i if k.to_s == "total"}
  end
end

convert_total(total)
convert_total(males)
convert_total(females)

# verify number of data
print "total:", total.length, "\n"
print "males:", males.length, "\n"
print "females:", females.length, "\n"

def write_to_file(name, data)
  open(name, 'w') { |f|
    f.puts data.to_json
  }  
end

missing = Array.new
for d in females
  if d[:total] == 0 && d[:subzone].to_s != "Total"
    missing << d[:subzone]
  end
end

count = 0
for d in females
  if d[:subzone].to_s != "Total"
    count = count + 1
  end
end

print "missing:", missing.length, "\n"
print "subzones count:", count

write_to_file("total.js", total)
write_to_file("males.js", males)
write_to_file("females.js", females)
write_to_file("missing.csv", missing)
