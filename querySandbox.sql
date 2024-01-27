select (strftime('%s', end_time) - strftime('%s', start_time)) / 60 from time_entry;

select round((strftime('%s', end_time) - strftime('%s', start_time)) / 60 / 60.0, 1) from time_entry;

select (strftime('%s', end_time) - strftime('%s', start_time)) / 60 from time_entry;

select date(start_time, 'localtime'), round(sum((strftime('%s', end_time) - strftime('%s', start_time)) / 60) / 60.0, 1)
from time_entry 
group by date(start_time, 'localtime')

