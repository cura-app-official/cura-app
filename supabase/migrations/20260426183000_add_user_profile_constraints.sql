alter table public.users
add constraint users_username_length_check
check (char_length(username) between 3 and 30);

alter table public.users
add constraint users_username_lowercase_check
check (username = lower(username));

alter table public.users
add constraint users_username_allowed_chars_check
check (username ~ '^[a-z0-9_.]+$');

alter table public.users
add constraint users_username_has_letter_check
check (username ~ '[a-z]');

alter table public.users
add constraint users_username_not_start_dot_check
check (username !~ '^\.');

alter table public.users
add constraint users_username_not_end_dot_check
check (username !~ '\.$');

alter table public.users
add constraint users_username_no_consecutive_dots_check
check (username !~ '\.\.');

alter table public.users
add constraint users_bio_length_check
check (bio is null or char_length(bio) <= 160);
