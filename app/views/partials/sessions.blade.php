<div class="sessions">
    @foreach(Config::get('schedule') as $session_group)
        @if(array_key_exists('end_time', $session_group))
            <?php $session_group['data_time'] = $session_group['end_time'] ?>
        @endif
    <div class="session-group" data-time="{{ $session_group['data_time'] }}">
        @include('partials.session')
    </div>
    @endforeach


</div>