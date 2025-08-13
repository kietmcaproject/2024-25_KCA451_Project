<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Site;
use Illuminate\Http\Request;
use Carbon\Carbon;

class SiteController extends Controller
{

    public function index()
    {
        $sites = Site::latest()->get();
        return view('Admin.sites.index', compact('sites'));
    }

    public function create()
    {
        return view('Admin.sites.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'site_date' => 'required|date',
            'site_name' => 'required|string|max:255',
            'site_location' => 'required|string|max:255',
            'owner_name' => 'required|string|max:255',
            'contractor_name' => 'required|string|max:255',
            'site_area' => 'required|numeric|min:0',
        ]);

        Site::create($validated);

        return redirect()->route('sites.index')->with('success', 'Site added successfully.');
    }

    public function view($id)
    {
        $site = Site::findOrFail($id);
        return view('Admin.sites.view', compact('site'));
    }

    public function edit($id)
    {
        $site = Site::findOrFail($id);
        return view('Admin.sites.edit', compact('site'));
    }

    public function update(Request $request, $id)
    {
        $site = Site::findOrFail($id);

        $validated = $request->validate([
            'site_date' => 'required|date',
            'site_name' => 'required|string|max:255',
            'site_location' => 'required|string|max:255',
            'owner_name' => 'required|string|max:255',
            'contractor_name' => 'required|string|max:255',
            'site_area' => 'required|numeric|min:0',
        ]);

        $site->update($validated);

        return redirect()->route('sites.index')->with('success', 'Site updated successfully.');
    }

    public function destroy($id)
    {
        $site = Site::findOrFail($id);
        $site->delete();

        return redirect()->route('sites.index')->with('success', 'Site deleted successfully.');
    }
}