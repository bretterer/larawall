<div class="sessions">
    @foreach(Config::get('schedule') as $session_group)
    <div class="session-group" data-time="{{ $session_group['data_time'] }}">
        @include('partials.session')
    </div>
    @endforeach


</div>