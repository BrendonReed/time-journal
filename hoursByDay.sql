
select date(start_time, 'localtime') day, round(sum((strftime('%s', end_time) - strftime('%s', start_time)) / 60) / 60.0, 1) hours
from time_entry 
group by date(start_time, 'localtime')
