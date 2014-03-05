
@foreach($session_group['sessions'] as $session)
<div class="session" style="background-image: url('{{ $session['image'] }}')" >
    <div class="session-details">
        @if($session['track'] != '')
            <h4>{{ $session['track'] }}</h4>
        @endif
        <h4>NEXT: {{ $session_group['time'] }}</h4>

        <h2>{{ $session['title'] }}</h2>
        <p>{{ $session['description'] }}</p>
        <small>{{ $session['room'] }}</small>
    </div>
</div>
@endforeach
