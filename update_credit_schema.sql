-- Add bonus_amount column to credit_requests table
alter table public.credit_requests 
add column if not exists bonus_amount integer default 0;

-- Update existing rows to have 0 bonus if null (though default handles it)
update public.credit_requests set bonus_amount = 0 where bonus_amount is null;
