<div class="bg-white app-shadow-lg rounded-xl p-6 overflow-x-auto">
    <table class="w-full border app-border-gray">
        <thead class="main-blue-bg text-white">
            <tr>
                <th class="p-2 text-left">Titre</th>
                <th class="p-2 text-left">Contenu</th>
                <th class="p-2 text-left">Date</th>
            </tr>
        </thead>
        <tbody>
            @foreach($announcements as $a)
                <tr class="border-b app-border-gray">
                    <td class="p-2">{{ $a->title }}</td>
                    <td class="p-2">{{ $a->content }}</td>
                    <td class="p-2">{{ $a->created_at->format('d M Y') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</div>